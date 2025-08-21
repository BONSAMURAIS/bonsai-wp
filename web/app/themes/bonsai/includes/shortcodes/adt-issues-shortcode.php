<?php
// Register the shortcode
function adt_issues_shortcode() {
    wp_enqueue_style('adt-issues-style', content_url('/themes/bonsai/dist/css/adt-issues.css'));

    $issues = adt_fetch_gitlab_issues();

    $labelsArray = [];
    $milestoneArray = [];

    foreach ($issues as $issue) {
        $labels = $issue['labels'];
        foreach ($labels as $label) {
            if (!in_array($label, $labelsArray)) {
                $labelsArray[] = $label;
            }
        }

        $milestone = $issue['milestone'];

        if ($milestone) {
            foreach ($milestone as $milestone) {
                if (!in_array($milestone, $milestoneArray)) {
                    $milestoneArray[] = $milestone;
                }
            }
        }
    }

    // Start output buffering
    ob_start();
    ?>
    <div class="flex issues-search">
        <input type="text" id="search" placeholder="Search issues" />
        <input type="text" id="labels" placeholder="Labels" readonly />
        <input type="text" id="milestones" placeholder="Milestones" readonly />
        <a href="https://gitlab.com/bonsamurais/bonsai/bug-report-website/-/issues/new" class="button primary" target="_blank">  
            
            New issue
        </a>
    </div>

    <?php 
    error_log("test git issues");
    $openedIssues = 0;
    $closedIssues = 0;
    $open_issues =array();
    $closed_issues =array();

    foreach ($issues as $issue) {
        if ($issue['state'] === 'opened') {
            $openedIssues++;
            $open_issues[] = $issue;
        } else {
            $closedIssues++;
            $closed_issues[] = $issue;
        }
    }
    // $string = json_encode($open_issues[0]);
    ?>

    <!-- List -->
    <div class="adt-issues-list">
        <table id="git-issue-table" class="adt-issues-table">
            <thead>
                <tr>
                    <th colspan="1">
                        <span class="issues-open"><span class="issues-open-count"><?= $openedIssues ?> </span> open</span>
                    </th>
                    <th colspan="3"></th>
                    <th colspan="1">Milestone</th>
                    <th colspan="1">Status</th>
                    <th colspan="1" onclick="sortTableByDate()">Date</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($open_issues as $issue) : ?>
                    <tr class="adt-issue <?php echo esc_attr($issue['state']); ?>">
                        <td colspan="4" class="adt-issue-title-wrapper">
                            <a href="<?= $issue['web_url'] ?>" target="_blank"><span class="issue-title"><?= $issue['title'] ?></span></a>
                            <div class="issue-tags-wrapper">
                                <?php if ($labelsArray) : ?>
                                    <?php foreach ($labelsArray as $label) : ?>
                                        <span class="issue-tag"><?= $label ?></span>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </div>
                        </td>
                        <td colspan="1" class="adt-issue-milestone"><?php echo esc_html($issue['milestone']['title'] ?? ""); ?></td>
                        <td colspan="1" class="adt-issue-status"><?php echo esc_html($issue['state']); ?></td>
                        <td colspan="1" class="adt-issue-status"><?php echo esc_html($issue['created_at']); ?></td>
                    </tr>
                <?php endforeach; ?> 
                <?php foreach ($closed_issues as $issue) : ?>
                    <tr class="adt-issue <?php echo esc_attr($issue['state']); ?>">
                        <td colspan="4" class="adt-issue-title-wrapper">
                            <a href="<?= $issue['web_url'] ?>" target="_blank"><span class="issue-title"><?= $issue['title'] ?></span></a>
                            <div class="issue-tags-wrapper">
                                <?php if ($labelsArray) : ?>
                                    <?php foreach ($labelsArray as $label) : ?>
                                        <span class="issue-tag"><?= $label ?></span>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </div>
                        </td>
                        <td colspan="1" class="adt-issue-milestone"><?php echo esc_html($issue['milestone']['title'] ?? ""); ?></td>
                        <td colspan="1" class="adt-issue-status"><?php echo esc_html($issue['state']); ?></td>
                        <td colspan="1" class="adt-issue-status"><?php echo esc_html($issue['created_at']); ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>

    <script>
        let sortDirection = 'asc';

        function sortTableByDate() {
            const table = document.getElementById("git-issue-table");
            const tbody = table.tBodies[0];
            const rows = Array.from(tbody.rows);

            const dateColIndex = 4;

            rows.sort((a, b) => {
                const dateA = new Date(a.cells[dateColIndex].innerText.trim());
                const dateB = new Date(b.cells[dateColIndex].innerText.trim());
                return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
            });

            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';

            tbody.innerHTML = '';
            rows.forEach(row => tbody.appendChild(row));
        }
    </script>
    <?php
    // Return the buffered content
    return ob_get_clean();
}

// Add the shortcode
add_shortcode('adt_issues', 'adt_issues_shortcode');
?>
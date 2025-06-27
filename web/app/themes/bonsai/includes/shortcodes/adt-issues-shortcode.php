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

    foreach ($issues as $issue) {
        if ($issue['state'] === 'opened') {
            $openedIssues++;
        } else {
            $closedIssues++;
        }
    }
    ?>

    <!-- List -->
    <div class="adt-issues-list">
        <table class="adt-issues-table">
            <thead>
                <tr>
                    <th colspan="1">
                        <span class="issues-open"><span class="issues-open-count"><?= $openedIssues ?> </span> open</span>
                        <span class="issues-closed"><span class="issues-closed-count"><?= $closedIssues ?> </span> closed</span>
                    </th>
                    <th colspan="3"></th>
                    <th colspan="1">Milestone</th>
                    <th colspan="1">Status</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($issues as $issue) : ?>
                    <?php 

                    $issueState = $issue['state'];
                    $labelsArray = $issue['labels'];

                    ?>
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
                        <td colspan="1" class="adt-issue-milestone"><?php echo esc_html($issue['milestone']); ?></td>
                        <td colspan="1" class="adt-issue-status"><?php echo esc_html($issue['state']); ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <?php
    // Return the buffered content
    return ob_get_clean();
}

// Add the shortcode
add_shortcode('adt_issues', 'adt_issues_shortcode');
?>